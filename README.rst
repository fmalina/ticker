Ticker (Front-End Technical Test)
=================================

Result: https://fmalina.github.io/ticker/
These guys didn't hire me :~.

Brief
-----

Implement a financials ticker grid using the CSV data provided.
TypeScript is preferred but prototypal JavaScript is fine otherwise.

The code should be written in an OO style. Any CSS written should use
BEM notation. **Do not use any 3rd party frameworks or libraries**.

The submission will be judged on its code quality, any performance
techniques employed and it’s structure.

As a rough guideline, it shouldn’t take longer than four hours. We’re
looking for code that is a good reflection on how you would normally
work. If you’re unable to finish, just submit what you have.

Requirements
------------

Initial View
~~~~~~~~~~~~

Load and parse the data in ``snapshot.csv`` into a model.

Render a grid based on that data to the DOM.

Updates
~~~~~~~

Write an engine to work through ``deltas.csv`` and emit update messages
to parse.

When only a number exists on a line, that amount of time in milliseconds
should be waited until processing the next set of deltas. When the last
set of deltas is processed, return to the start of the file and repeat.

Each set of deltas should be merged into the existing dataset and then
propagated to the DOM in the most efficient manner possible.

Provide notification that an item has been updated via a visual flare in
the UI.

Bonus Task
~~~~~~~~~~

Render a chart in canvas based on the tick data to show the changes over
time. It should update on each tick.

    .. rubric:: Links
       :name: links

    | `An Introduction to the BEM Methodology`_
    | `TypeScript`_

.. _An Introduction to the BEM Methodology: http://webdesign.tutsplus.com/articles/an-introduction-to-the-bem-methodology--cms-19403
.. _TypeScript: http://www.typescriptlang.org/