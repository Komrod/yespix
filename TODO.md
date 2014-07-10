
TODO list:

- handle gid and multiple tileset on level
- handle tileset with multiple lines
- level collision loop when outside level
- fix level collision with floor after jump, make children position relative to parent
- fix parallax y of level layers
- option stopAtBorders that makes the level follow stops at level border
- set a pixelSize for the level
- actor2w disociate speed and direction
- level follow change position relative to entity speed
- auto attach every entity to the current level
- make layer a general empty drawable canvas (view), put the level build on the level entity
- create a sprite entity from anim enity
- make drawDebug(), drawDebugPosition(), drawDebugImage(), drawDebugCollision(), drawDebugMove()
- make a debug panel where you can change variables and see entities
- on actor entity, make walk animation speed progressive
- fix bug collision between entities
- Make a basic Zombie Sim
- tag version 0.1.4
- remove entity._instances array = obsolete
- limit image draw to visible canvas when an image try to draw partialy outside the canvas
- animate properties
- tiled level import
- draw text
- draw polygon, line, circle, elipse, star
- tag version 0.1.5
- draw SVG image
- rotation
- parent position and rotation affect children
- Make an Arkanoid game
- tag version 0.1.6
- font from image
- typewritter: text showing letter by letter with sound
- panel
- button
- Add fillAlpha and lineAlpha in rect entity
- Make a Steel Sky game (raiden like)
- tag version 0.1.7
- duplicate, add, remove image
- use Object.create in the mixin() function
- function key() detects if any key is pressed
- function keyCapture() stops the propagation of the pressed key
- tag version 0.1.8
- Bunch must concat, splice, push with arrays
- create temporary class with space, not only with "," like yespix.spawn('rect move')
- check if all YESPIX classes are fully loaded on first frame
- Make a Raider game (platform indiana)
- tag version 0.1.9
- Create a function to add / remove modules
- Create a DEV trunk and separate modules with entity definitions
- Add optional CombineWith and conflictWith properties to the entity definitions
- Add SVG entity
- Add eyefx entity to add webGL effects filters to the canvas (with glfx.js)
- tag version 0.2
- Make the Chuck game


DONE:
- fix level collision when level is not at (0,0)
- fix layer opacity // 2014-06-30
- fix player get throught floor on high gravity
- entity.isReady set True when all entity files loaded and entityReady event launch
- fix follow big level
- level follow an entity
- parallax layer // 2014-06-25
- getDrawBox sometimes get x and y as NaN on actor2w
- move level view, make attached entities move on parent move
- fix level collision on level position // 2014-06-23
- property entityUnique True to be sure that only one instance of the entity is spawned
- multiple layer level
- layer alpha and type (decor)
- Add path entity for objects
- unit test: instanciation
- make examples work
- unit test: general function
- new unit test system
- new initialisation for entities
- Change the TODO list // 2014-05-12
- rearranging folders
- function visible() returns true if gfx entity is visible on canvas
- switch speed to pixel-per-second and optionnaly pixel-per-frame
- first(), first(50), last(), last(5), not(id), not(this), filter('even'), filter('odd') for Bunch
- gravity and objects colliding on floor // 2013-12-19
- fix diagonal collision
- create actor and player entity
- fix pixelSize bug with animation and collision
- function clone() on entity
- function over() under() inside() outside() intersect() touch() // 2013-12-05
- use alpha transparency
- Pong Tennis game
- collision and function to get the hit box // 2013-12-04
- chainable function calls on Bunch
- function prop() to change an entity property (to use with Bunch)
- Call entity functions on a Bunch // 2013-11-28
- Bunch entities must be unique
- function to get the draw box coordinates
- show some debug on image // 2013-11-26
- on change z or zGlobal, sort the next draw
- on insert or delete gfx entities, change the draw list
- change the YESPIX draw to sort instances by z
- change an image width and height // 2013-11-26
- pixel scale of an image
- extends animation // 2013-11-25
- Snap image to pixel grid on entity // 2013-11-25
- Make a basic 4 ways player // 2013-11-25
- animation entity // 2013-11-22
- complete the find method and the bunch // 2013-11-21
- do the variable listener // 2013-11-18
- handle keys // 2013-11-14
- do the children manager // 2013-11-13
- make functions to handle instances in YESPIX engine and _instances in entity
- change _name to name because it's not unique and private // 2013-11-13
- do not store the progress in the file object // 2013-11-11
- "cache" object name switch to "file" object // 2013-11-11
- do not put downloaded file content in memory cache // 2013-11-10
- make a YESPIX engine class to be instanciated
- build a system to make the unit tests


CANCELED:
- override the yespix function to do something else after init // cant instanciate new YESPIX object after that


PENDING:
- do real js classes with prototype for entity classes
- do a partial draw for each gfx entities
- prerender canvas for the partial draw
- function xload which try to execute an action depending the extension of the loaded file (execute a .js script, add .css file to document ...)



