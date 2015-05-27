#! /bin/bash
set -e
set -x

LAST_COMMIT=$(git rev-parse HEAD)

cp config.js ../web/.
(cd ../web; npm install; cd semantic; gulp build; cd ..; gulp build)
(cd ../api; npm update)

(cd ..;
  docker build -t quay.io/buildo/cashflow:$LAST_COMMIT .;
  docker tag -f quay.io/buildo/cashflow:$LAST_COMMIT quay.io/buildo/cashflow:latest;

  docker push quay.io/buildo/cashflow:$LAST_COMMIT;
  docker push quay.io/buildo/cashflow:latest
)
