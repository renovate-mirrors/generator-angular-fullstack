/**
 * User model events
 */

import {EventEmitter} from 'events';<% if (filters.sequelizeModels) { %>
import {User} from '../../sqldb';<% } %>
var UserEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
UserEvents.setMaxListeners(0);

// Model events<% if (filters.mongooseModels) { %>
var events = {
    save: 'save',
    remove: 'remove'
};<% } if (filters.sequelizeModels) { %>
var events = {
    afterCreate: 'save',
    afterUpdate: 'save',
    afterDestroy: 'remove'
};<% } %>

// Register the event emitter to the model events
function registerEvents(User) {
    for(var e in events) {
        let event = events[e];<% if (filters.mongooseModels) { %>
        User.post(e, emitEvent(event));<% } if (filters.sequelizeModels) { %>
        User.hook(e, emitEvent(event));<% } %>
    }
}

function emitEvent(event) {
    return function(doc<% if (filters.sequelizeModels) { %>, options, done<% } %>) {
        UserEvents.emit(event + ':' + doc._id, doc);
        UserEvents.emit(event, doc);<% if (filters.sequelizeModels) { %>
        done(null);<% } %>
    }
}
<% if (filters.sequelizeModels) { %>
registerEvents(User);<% } if (filters.mongooseModels) { %>
export {registerEvents};<% } %>
export default UserEvents;
