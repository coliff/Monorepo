# https://github.com/casey/just

# @see https://github.com/Devographics/Monorepo/pull/114
# Gatsby result app is currently opted-out of PNPM because of the patch on Apollo client needed for Next
install:
    pnpm install;
    cd {{justfile_directory()}}/results yarn install;

# For external and internal APIs
redis:
    docker run --rm -p 6379:6379 --label devographics-redis redis

# HTTP proxy, use in combination with "redis" to simulate
# a serverless environment locally (upstash)
# The token specified here is the token that must be passed to your upstash client
redis-http:
    docker run \
    --rm \
    -p 8080:80 \
    --label srh \
    -e SRH_MODE=env \
    -e SRH_TOKEN=fake-dev-token \
    -e SRH_CONNECTION_STRING="redis://localhost:6379" \
    hiett/serverless-redis-http:latest

# For Next surveyform and APIs
# Use Compass to access the DB via GUI
mongo:
    docker run \
    --rm \
    -p 27017:27017 -v "$(pwd)"/.mongo:/data/db --label devographics-mongodb mongo:4.0.4

# @see https://www.npmjs.com/package/concurrently
# @see https://stackoverflow.com/questions/47207616/auto-remove-container-with-docker-compose-yml
# It is not currently possible to automatically remove containers using docker-compose.yml
# so it's easier tp run both commands concurrently
# Exec from justfile_directly so we avoid having .mongo everywhere
dbs:
    cd {{justfile_directory()}} && pnpm exec concurrently --prefix-colors "bgRed,bgMagenta,bgGreen" \
    --names "redis,redis-http,mongo" "just redis" "just redis-http" "just mongo";

# (nx experiment) Create local build
# Don't forget to run Redis and Mongo dbs
# build:
#     pnpm exec nx run-many --target=build
#     cd {{justfile()}}/result yarn run build;

default:
    @just --list --justfile {{justfile()}}

docker-build-surveyadmin:
    docker build -f ./docker/surveyadmin.prod.dockerfile -t surveyadmin .

docker-run-surveyadmin:
    docker run -p 3000:3000 --env-file {{justfile_directory()}}/surveyadmin/.env.development -it surveyadmin:latest

