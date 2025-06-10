const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8001;

// 미들웨어 설정
// CORS를 특정 도메인으로 제한
app.use(cors({
    origin: ['http://localhost:8001', 'http://127.0.0.1:8001', 'http://itsmyzone.iptime.org'],
    credentials: true
}));
app.use(express.json());

// 정적 파일 서빙을 특정 파일들로 제한
app.use('/css', express.static(path.join(__dirname, '..', 'css')));
app.use('/js', express.static(path.join(__dirname, '..', 'js')));
app.use('/images', express.static(path.join(__dirname, '..', 'images')));

// SQLite 데이터베이스 초기화
const db = new sqlite3.Database('./minesweeper.db', (err) => {
    if (err) {
        console.error('데이터베이스 연결 실패:', err.message);
    } else {
        console.log('SQLite 데이터베이스에 연결되었습니다.');
        initializeDatabase();
    }
});

// 데이터베이스 테이블 초기화
function initializeDatabase() {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            player_name TEXT NOT NULL,
            time INTEGER NOT NULL,
            difficulty TEXT NOT NULL,
            date_created DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    db.run(createTableQuery, (err) => {
        if (err) {
            console.error('테이블 생성 실패:', err.message);
        } else {
            console.log('scores 테이블이 준비되었습니다.');
        }
    });
}

// API 라우트 (지뢰찾기 전용)

// 모든 순위 조회 (GET /main-api/minesweeper/scores)
app.get('/main-api/minesweeper/scores', (req, res) => {
    const difficulty = req.query.difficulty;
    
    let query = `
        SELECT player_name, time, difficulty, date(date_created) as date
        FROM scores
    `;
    
    let params = [];
    if (difficulty) {
        query += ' WHERE difficulty = ?';
        params.push(difficulty);
    }
    
    query += ' ORDER BY difficulty, time ASC';
    
    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('순위 조회 실패:', err.message);
            res.status(500).json({ error: '순위 조회 중 오류가 발생했습니다.' });
        } else {
            // 난이도별로 그룹화하고 상위 10개만 반환
            const scoresByDifficulty = {
                beginner: [],
                intermediate: [],
                expert: []
            };
            
            rows.forEach(row => {
                if (scoresByDifficulty[row.difficulty] && scoresByDifficulty[row.difficulty].length < 10) {
                    scoresByDifficulty[row.difficulty].push({
                        name: row.player_name,
                        time: row.time,
                        difficulty: row.difficulty,
                        date: row.date
                    });
                }
            });
            
            res.json(scoresByDifficulty);
        }
    });
});

// 새 점수 저장 (POST /main-api/minesweeper/scores)
app.post('/main-api/minesweeper/scores', (req, res) => {
    const { player_name, time, difficulty } = req.body;
    
    // 입력 검증
    if (!player_name || !time || !difficulty) {
        return res.status(400).json({ error: '필수 필드가 누락되었습니다.' });
    }
    
    if (!['beginner', 'intermediate', 'expert'].includes(difficulty)) {
        return res.status(400).json({ error: '올바르지 않은 난이도입니다.' });
    }
    
    if (typeof time !== 'number' || time < 0) {
        return res.status(400).json({ error: '올바르지 않은 시간입니다.' });
    }
    
    const insertQuery = `
        INSERT INTO scores (player_name, time, difficulty)
        VALUES (?, ?, ?)
    `;
    
    db.run(insertQuery, [player_name, time, difficulty], function(err) {
        if (err) {
            console.error('점수 저장 실패:', err.message);
            res.status(500).json({ error: '점수 저장 중 오류가 발생했습니다.' });
        } else {
            console.log(`새 점수 저장됨: ${player_name} - ${time}초 (${difficulty})`);
            res.json({ 
                success: true, 
                id: this.lastID,
                message: '점수가 성공적으로 저장되었습니다.'
            });
        }
    });
});

// 순위 초기화 (DELETE /main-api/minesweeper/scores)
app.delete('/main-api/minesweeper/scores', (req, res) => {
    const deleteQuery = 'DELETE FROM scores';
    
    db.run(deleteQuery, (err) => {
        if (err) {
            console.error('점수 삭제 실패:', err.message);
            res.status(500).json({ error: '점수 삭제 중 오류가 발생했습니다.' });
        } else {
            console.log('모든 점수가 삭제되었습니다.');
            res.json({ success: true, message: '모든 점수가 삭제되었습니다.' });
        }
    });
});

// 특정 난이도의 순위 조회 (GET /main-api/minesweeper/scores/:difficulty)
app.get('/main-api/minesweeper/scores/:difficulty', (req, res) => {
    const difficulty = req.params.difficulty;
    
    if (!['beginner', 'intermediate', 'expert'].includes(difficulty)) {
        return res.status(400).json({ error: '올바르지 않은 난이도입니다.' });
    }
    
    const query = `
        SELECT player_name, time, date(date_created) as date
        FROM scores
        WHERE difficulty = ?
        ORDER BY time ASC
        LIMIT 10
    `;
    
    db.all(query, [difficulty], (err, rows) => {
        if (err) {
            console.error('순위 조회 실패:', err.message);
            res.status(500).json({ error: '순위 조회 중 오류가 발생했습니다.' });
        } else {
            res.json(rows.map(row => ({
                name: row.player_name,
                time: row.time,
                date: row.date
            })));
        }
    });
});

// 지뢰찾기 전용 루트 경로
app.get('/minesweeper', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// 루트 경로는 API 정보만 제공
app.get('/', (req, res) => {
    res.json({
        name: 'Minesweeper API Server',
        version: '1.0.0',
        endpoints: {
            'GET /main-api/minesweeper/scores': '모든 순위 조회',
            'POST /main-api/minesweeper/scores': '새 점수 저장',
            'DELETE /main-api/minesweeper/scores': '순위 초기화',
            'GET /main-api/minesweeper/scores/:difficulty': '난이도별 순위',
            'GET /minesweeper': '지뢰찾기 게임 실행'
        }
    });
});

// 404 핸들러
app.use((req, res) => {
    res.status(404).json({ error: '요청하신 리소스를 찾을 수 없습니다.' });
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`🚀 지뢰찾기 서버가 포트 ${PORT}에서 실행 중입니다.`);
    console.log(`📱 http://localhost:${PORT} 에서 접속하세요.`);
});

// 프로세스 종료 시 DB 연결 정리
process.on('SIGINT', () => {
    console.log('\n서버를 종료합니다...');
    db.close((err) => {
        if (err) {
            console.error('DB 연결 종료 실패:', err.message);
        } else {
            console.log('DB 연결이 정상적으로 종료되었습니다.');
        }
        process.exit(0);
    });
}); 