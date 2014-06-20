/**
 ************************************************************************************************************
 * CHILDREN
 */

/**
 * @todo  moving rotating the parent will affect the children
 * @param {entity} parent The parent
 * @param {entity|array} child An entity to attached or an array of entities
 * @example attach(entity1, entity2) attaches entity2 to entity1
 * @example attach(entity1, [entity2, entity3 ...]) attaches multiple entities to entity1
 */
yespix.fn.attach = function(parent, child) {
    // multiple children
    if (this.isArray(child)) {
        for (var t = 0; t < child.length; t++) this.attach(parent, child[t]);
        return this;
    }

    // try to attach an entity already attached to the parent
    if (child._parent == parent) return null;

    // attach
    if (parent._children) console.log('attach :: parent._children = '+parent._children.length);
    else console.log('attach :: parent._children = 00');

    if (!parent._children) parent._children = [child];
    else parent._children.push(child);

    console.log('attach :: parent._children = '+parent._children.length);

    if (child._parent) this.detach(child._parent, child);
    child._parent = parent;
    return this;
};

yespix.fn.detach = function(parent, child) {
    var t;

    // detach everything 
    if (!child) {
        if (parent._children) {
            for (t = 0; t < parent._children.length; t++) parent._children[t]._parent = null;
            parent._children = null;
        }
        return this;
    }

    // detach all the children
    if (this.isArray(child)) {
        for (t = 0; t < child.length; t++) this.detach(parent, child[t]);
        return this;
    }

    // try to detach an entity already detached
    if (child._parent != parent) return null;

    // detach one child
    child._parent = null;
    for (t = 0; t < parent._children.length; t++)
        if (parent._children[t] == child) {
            parent._children.splice(t, 1);
            break;
        }
    return this;
};
