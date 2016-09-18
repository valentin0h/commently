import {Template} from 'meteor/templating';
import {ReactiveDict} from 'meteor/reactive-dict';
import {Comments} from '../imports/api/tasks.js';
import rangy from 'rangy';
import rangyClassApplier from 'rangy/lib/rangy-classapplier';
import rangyHighlight from 'rangy/lib/rangy-highlighter';
import rangyTextRange from 'rangy/lib/rangy-textrange';
import rangySerializer from 'rangy/lib/rangy-serializer';
import {jQuery} from 'jquery';


import './main.html';

var serializedRange = null;
var loremIpsumNode;
var sel;
var highlighter;


Template.body.onRendered(function () {
    loremIpsumNode = document.getElementById("lorem-ipsum");

    Session.set('selected', null);

    rangy.init();
    highlighter = rangyHighlight.createHighlighter();
    var classApplier = rangy.createClassApplier("highlight", {
        tagNames: ["span", "a"],
    });
    highlighter.addClassApplier(classApplier);
});


Template.body.events({
    'click #add-comment' (event, instance) {
        event.preventDefault();
        Session.set('selected', null);

        var sel = rangy.getSelection();
        if (sel.toString()) {
            serializedRange = rangy.serializeRange(sel.getRangeAt(0), true, loremIpsumNode);
            highlighter.removeAllHighlights();
            sel.removeAllRanges();
        }
        else {
            alert("Please select some text to comment on.");
            highlighter.removeAllHighlights();
            return false;
        }
    },
    'click #save-comment' (event, instance) {
        var commentText = instance.$("#commentText").val();

        Comments.insert({
            text: commentText,
            range: serializedRange
        });
        highlighter.removeAllHighlights();

        sAlert.success('Comment added!');
    },
    'click .comments .comment-wrap' (event, instance) {
        highlighter.removeAllHighlights();

        // get range and deserialize
        var comment = Comments.findOne({_id: this._id}, {range: 1});

        var range = rangy.deserializeRange(comment.range, loremIpsumNode);
        var sel = rangy.getSelection();
        sel.setSingleRange(range);

        // highlight and remove range
        highlighter.highlightSelection("highlight");

        Session.set('selected', this._id);
        sel.removeAllRanges();
    },
    'mousedown #lorem-ipsum' (event, instance) {
        highlighter.removeAllHighlights();
        Session.set('selected', null);
    },
    'click #clear-all-comments' (event, instance) {
        highlighter.removeAllHighlights();
        Meteor.call('removeAllComments'); // server side
        sAlert.success('All comments removed.');
    }
});

Template.comments.onCreated(function() {
    this.state = new ReactiveDict;
    this.state.set('isSelected', null);
});

Template.comments.helpers({
    comment: function () {
        return Comments.find();
    },
    isSelected: function() {
        return this._id ===  Session.get('selected') ? 'selected' : '';
    }
});

Template.comments.events({
    'click button.delete-comment'(event, instance) {
        event.preventDefault();
        highlighter.removeAllHighlights();
        Comments.remove({_id: this._id});
    }
});
