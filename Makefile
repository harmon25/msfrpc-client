BABEL = ./node_modules/.bin/babel
SRC = $(wildcard src/*.js)
LIB = $(SRC:src/%.js=node/%.js)

build: $(LIB)

node/%.js: src/%.js
	@mkdir -p $(@D)
	@$(BABEL) $< > $@
 
clean: 
	@rm -R $(LIB)