import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';

class AppStore extends EventEmitter {

	constructor() {
		super();
		this.appState = {};
	}

	setAppData(data) {
		this.appState = data;
		this.emitChange();
	}

	get appStateData() {
		return this.appState;
	}

	emitChange() {
		this.emit('APP_CHANGE_EVENT');
	}

	addChangeListener(callback) {
        this.on('APP_CHANGE_EVENT', callback);
    }

    removeChangeListener(callback) {
        this.removeListener('APP_CHANGE_EVENT', callback);
    }
}

const appStore = new AppStore;

appStore.dispatchToken = AppDispatcher.register((action) => {

	switch (action.actionType) {
		case ActionTypes.APP_INITIALIZED:
			facebookSstore.setAppData(action.data);
		break;
	}

});

module.exports = appStore;
