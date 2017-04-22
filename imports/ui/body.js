import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tasks } from '../api/tasks.js';

import './task.js';
import './body.html';

Template.body.onCreated(function bodyOnCreated() {
    console.log(this);
    this.state = new ReactiveDict();
    Meteor.subscribe('tasks');
});

Template.body.helpers({
    // tasks from database collection
    tasks() {
        const instance = Template.instance();
        if (instance.state.get('hideCompleted'))
        {
            // if hide completed is checked, filter tasks
            // { $ne: true } OR { $eq: false }
            return Tasks.find({ checked: { $ne: true }}, { sort: { createdAt: -1} });
        }

        // otherwise, returan all of the tasks, show newest tasks at the top
        return Tasks.find({}, { sort: { createdAt: -1 } });
    },
/*  // tasks as static array
    tasks: [
        { text: 'This is task 1' },
        { text: 'This is task 2' },
        { text: 'This is task 3' },
        ], */
    incompleteCount() {
        return Tasks.find({ checked: { $ne: true } }).count();
    },
});

Template.body.events({
    'submit .new-task'(event) {
        // prevent default browser form submit
        event.preventDefault();

        // get value from form element
        const target = event.target;
        const text = target.text.value;
        console.log(event);

        // insert a task into the collection
        Meteor.call('tasks.insert', text);

        // clear form
        target.text.value = '';
    },
    'click .hide-completed'(event, instance) {
//    'change .hide-completed input'(event, instance) {
        console.log(event.target);
        instance.state.set('hideCompleted', event.target.checked);
    },
});
