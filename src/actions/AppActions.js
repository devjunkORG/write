var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');

var AppActions = {

	initialize: function(data) {

        // when done, trigger APP_INITIALIZED event
		AppDispatcher.handleAction({
			actionType: ActionTypes.APP_INITIALIZED,
			data: data
		});
	}

};

module.exports = AppActions;
