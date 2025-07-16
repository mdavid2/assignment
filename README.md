# It Works on My Machine

A lightweight Node.js app with Express, designed to demonstrate CI/CD pipelines.

---

My CI/CD approch:
1. whenever a developer pushes to his remote working branch (i.e. feture/**) a static code analysis pipeline starts running (static-code-analysis.yml):
  - linters (Prettier and ESlint)
  - security scans for vulnerabilities (Snyk, could be also Sonatype, lifecycle etc.)
  - unit tests (with artifact uploading + test summary in UI)
  - this is happening for every push, in order to detect code issues in an early phase and to lighten burden on the long PR pipeline (also, this checks are not env related).
2. once a merge request is created, a full pipeline starts (pr-qa-stg.yml):
  - build QA enviroment (currently doesn't really do anything, in real life will have other steps or can be removed)
  - tag the commit (in real life would use proper versioning) and deploy to QA (in real life will include pushing image to remore repository, deploying to EKS etc.)
  - run sanity after deployment - currently only using the /health endpoint, in reallife should include more tests.
  - if sanity passed, run (in parallel) funcational (with artifact uploading + test summary in UI) + integration tests (can add or remove tests, like component, depands on service/project needs)
  - if any of the 3 previous test suites fails - rollback the image in QA and pipeline stops with failure
  - if all tests passed in QA - add a 'qa-stable' tag and continue to STG
  - build STG
  - tag and deploy STG
  - run sanity tests in STG (currently only /health endpoint, will be different in real life)
  - if STG sanity passed, run in parallel - e2e, regression and performance (can add more test suites, and changed to run sequentially if it might interfere with one another)
  - if any of the previous test suites fails - rollback the image in STG and pipeline stops with failure
  - if all tests passed - add a 'stg-stable' tag
  - slack notifications only on failures (silent slack channel to prevent noise of messages)
3. only after the pipeline finished with sucess, the reviewer can merge the PR (checks prevent push if any of the requeired steps failed)
4. when merge request is approved and merged, a second pipeline starts (pr-prod.yml):
  - build prod
  - tag and deploy
  - run smoke/sanity tests
  - if tests failed - rollback prod environment
  - if tests passed - tag with 'prod-stable'
  - send slack notification with prod deployment status (passed/failed)

---

Extra notes:
while working I also tried to implement a second approach (prod-release.yml):
1. after PR pipeline of QA + STG finished, the 'stg-stable' tag update will trigger a prod-release pipeline:
  - create a 'realse' branch for prod
  - deploy it to prod
  - run tests
  - if tests fail - rollback prod env
  - if tests pass - update prod-stable and only then merge the MR to main
2. this way, we only merge to main after we verify that everything is working in production, and also get a fully automated process from coding to prod and main without manual intervention (the production deployment process is triggered by updating the 'stg-stable' tag).
3. on the other hand, we remain with open merge requests (or need to create a mechanisem to handle them), and also lose control over what gets pushed to prod (no human verification/approvals).
4. in any way, I run into issues with the commits and tags, and it started to take too much time debugging, so I remained with the first approach.
5. I also added another endpoint - '/status' + functional tests for it, to simulate the functional tests job

---

If I had more time:
1. I would use Semantic Versioning (SemVer).
2. try to complete the 2nd approch for prod relase with the stg-stable tag trigger.
3. fix the linter/security tests. they are currently failing and it would take me time to try to fix it as I am not familiar with node.js (I have marked them as optional and are not required to pass in order to push to prod).
