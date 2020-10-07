import * as recast from "recast";
const b = recast.types.builders;

module.exports = function (fileInfo, api) {
	// console.log(api.jscodeshift(fileInfo.source).getAST()[0]);
	const j = api.j;
	return api.jscodeshift(fileInfo.source)
		.find('BlockStatement')
		.forEach(function (path) {
			const line_string = `line: ${path.value.loc.start.line}, column: ${path.value.loc.start.column}`;
			path.value.body.unshift(
				j.expressionStatement(j.callExpression(
					j.identifier('console.log'), [j.literal(`path: ${fileInfo.path}, ${line_string}`)]
				))
			)
		})
		.toSource();
}