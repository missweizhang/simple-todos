import { Template } from 'meteor/templating';

import { Tasks } from '../api/tasks.js';

import './body.html';

Template.body.helpers({
    // tasks from database collection
    tasks() {
        // show newest tasks at the top
        return Tasks.find({}, { sort: { createdAt: -1 } });
    },
    
/*  // tasks as static array
    tasks: [
        { text: 'This is task 1' },
        { text: 'This is task 2' },
        { text: 'This is task 3' },
    ], */
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
        Tasks.insert({
            text,
            createdAt: new Date(), // current time
        });

        // clear form
        target.text.value = '';
    },
});
