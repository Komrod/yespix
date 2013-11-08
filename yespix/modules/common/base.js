yespix.entity.define('base',
{
	// entity class
	_type: '',
	
	// mixin ancestors
	_ancestors: [],
	
	// active
	isActive : true, 

	// visible
	isVisible : false,

	isGlobal : false,

	// name of the instance
	name : '',

	// id of the instance
	id : 1,

	// scene the entity started with
	scene : '',
	
	// assets urls in a list
	assets : [],
	
	///////////////////////////////// Main functions ////////////////////////////////
	
	// initilize object
	init : function() 
	{
		if (!yespix.data.entity)
		{
			yespix.data.entity = {
				id: 1,
			};
		}
		this._id = yespix.data.entity.id++;
		this._name = 'entity-'+this._id;

		return true;
	},
	
});
yespix.entity.rootClassname = 'base';

