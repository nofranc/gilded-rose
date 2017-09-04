# gilded-rose

## How to run application

Clone git repo, navigate to gilded-rose directory and open index.tpl.html in a browser of your choice.

## Responses
### At a high level, how does your system work?

We have two singletones (AngularJS factories): InventoryItemFactory and InventoryFactory.

InventoryItemFactory holds the definition for an InventoryItem class. Each inventory item has a name, sell-in value, and quality value. During instantiation of a particular inventory item, one can input a set of configurations, which determine how the sell-in and quality values will be updated.

InventoryFactory is where the 5 different inventory items (Aged Brie, Sulfuras the Legendary Sword, Backstage Pass, Conjured Shield, and Regular Shield) are instantiated and shared across the application. 

Clicking on the "Update" button iterates through the collection (returned by the InventoryFactory) and updates each individual item. Clicking on the "Reset" button does the same process but using a different function invocation.

### How would we extend your system if we had to add additional (100+) inventory items?

If we stick to having an AngularJS application with no back-end, depending on the kinds of additional items that would need to be defined, the set of configurations that is used by InventoryItemFactory may need to be enhanced. Additionally, configuration objects would need to be defined and added to the InventoryFactory singleton. Having such a large collection in a single file would definitely be difficult to process. Without adding additional pages, we could create files to host subsets of these configuration objects. If this isn't sufficient, we may consider creating additional screens with restricted access that would enable us to add, modify, and remove configurations from the list (i.e. to define additional inventory items and its behavior).

### What documentation, websites, papers, etc. did you consult for this assignment?
  * http://raganwald.com/2014/01/14/the-new-javascript-problem.html
  * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random

### What third-­party libraries or other tools does your application use? How did you choose each library or framework you used?

The only third-party library I used is lodash for certain functionality like checking types or mitigating null pointer exceptions and enabled me to concentrate on logic particular to this prompt.

AngularJS (v1.x) is a framework I am comfortable and was more than sufficient to complete this assignment. If I had more time, I would've investigated Angular 4 or React and evaluated which would have given me as close to what I needed for this prompt.

### How long did you spend on this exercise? If you had unlimited time to spend on this, how would you spend it and how would you prioritize each item?

I spent around 5 to 6 hours on this exercise.

Given more time, I would've created unit tests, done performance tests, implemented a build process, formalized documentation by using ngdoc (similar idea to javadoc), and enhanced the look of the page using either Grunt or Gulp. Assuming that the scale of the application is currently how it is, then I would've prioritized testing and formalization of documentation since the additional efficiency from integrating a task runner would be minimal. Enhancing the look would've been the last priority.

### If you were going to implement a level of automated testing to prepare this for a production environment, how would you go about doing so?

Apart from unit tests, the only other functionality the would need to be tested is ensuring that the table appears properly and the "Update" and "Reset" buttons properly update the table. I would use Protractor for this.

### If you were to critique your code, what would you have to say about it?

Some of my variable names could be less verbose.

At certain points, I've made decisions on certain implementations that I would've liked to confer with someone else about. While the different ways I could've gone may not seem too different, I would've liked another's opinion on the matter. For example, inside InventoryItemFactory's updateQualityValue() definition, starting from l. 144, I update degradeByValue's definition (to account for the default value) after having validated the values returned by the degradeBy and enhanceBy functions, enhanceByValue and degradeByValue). Typically, you account for default values when you first define variables. Could this "delayed definition" be confusing to read?

With the way InventoryItemsFactory is currently defined, we couldn't have private variables like we could had the class been defined as a function and the "new" keyword been used. I could've defined the class as aforementioned or indicated private variables by prefixing them with a "_".