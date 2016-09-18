import { Meteor } from 'meteor/meteor';
import { Comments } from '../imports/api/tasks.js';

Meteor.startup(() => {
    return Meteor.methods({
        removeAllComments: function() {
            return Comments.remove({});
        }
    });
});
