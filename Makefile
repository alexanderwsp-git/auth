# Use Bash
SHELL := /bin/bash

# Run the development server
start-dev:
	BUILD_TARGET=dev docker-compose up --build -d

restart-dev:
	docker-compose down && BUILD_TARGET=dev docker-compose up --build -d
logs:
	docker logs -f auth

watch:
	npm run dev

mg:
	@if [ -z "$(name)" ]; then \
		echo "❌ You must provide a migration name like: make mg name=param"; \
		exit 1; \
	fi
	npm run migration:generate --name=$(name)

# Run pending migrations
mr:
	npm run migration:run

mrvt:
	npm run migration:revert

# Run everything (Generate Migration + Apply Migrations + Start Server)
setup:
	@if [ -z "$(name)" ]; then \
		echo "❌ You must provide a migration name like: make mg name=param"; \
		exit 1; \
	fi
	npm run migration:generate --name=$(name)
	npm run migration:run
	npm run dev