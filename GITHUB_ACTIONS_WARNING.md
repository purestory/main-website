# 🚨 GitHub Actions 자동 배포 경고

## 중요: 삭제 금지 파일

다음 파일들은 **절대 삭제하지 마세요**:

- `.github/workflows/deploy.yml` - 자동 배포 워크플로우
- `GITHUB_ACTIONS_WARNING.md` - 이 경고 파일

## 자동 배포 시스템

이 프로젝트는 GitHub Actions를 사용하여 자동 배포됩니다.

### 작동 방식:
1. `jules_wip_4591432813991362156` 브랜치에 push
2. GitHub Actions 자동 트리거
3. 서버에 SSH 접속하여 `git pull` 실행
4. 웹사이트 자동 업데이트

### 삭제 시 문제점:
- 자동 배포 중단
- 수동으로 서버 접속 필요
- git pull 수동 실행 필요

## 복구 방법 (삭제 시):
```bash
git checkout 1ae5e59 -- .github/workflows/deploy.yml
git add .github/workflows/deploy.yml
git commit -m "restore: GitHub Actions auto-deploy workflow"
git push origin jules_wip_4591432813991362156
```

**기억하세요: 이 파일들은 프로젝트의 핵심 인프라입니다!** 