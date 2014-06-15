import fs = require('fs');

import sinonChai = require('../../sinon-chai');
var expect = sinonChai.expect;


// ReSharper disable WrongExpressionStatement
describe('gulp-blink', () => {

	['streaming', 'buffer'].forEach(mode => {
		describe(mode + ' mode', () => {

			['foo', 'bar'].forEach(foobar => {
				it('compiles expected ' + foobar + ' output', done => {

					fs.readFile('tmp/test/actual/stream/' + foobar + '.css', (err, actual) => {
						if (err) {
							throw err;
						}

						fs.readFile('test/expected/' + foobar + '.css', (err2, expected) => {
							if (err2) {
								throw err2;
							}

							expect(actual.toString()).to.eq(expected.toString());
							done();
						});
					});
				});
			});
		});
	});

});
