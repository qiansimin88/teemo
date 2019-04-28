const assert = require('assert');
const order = require('../../utils').order;
const rule = [ 1, 3, 2, 4, 5 ];
const keyword = 'id';
var data = [
	{
		id: 1,
		name: 1
	},
	{
		id: 2,
		name: 2
	},
	{
		id: 3,
		name: 3
	},
	{
		id: 4,
		name: 4
	},
	{
		id: 5,
		name: 5
	}
];

describe('util.order test', function(){
	it('normal test', function(){
		return order( data, rule, keyword ).then( data => {
			rule.forEach( ( key, index ) => {
				if( data[ index ] )  assert.ok( data[ index ][ keyword ] === key );
			} );
		} );
	});
});