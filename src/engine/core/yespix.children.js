/**
 ************************************************************************************************************
 * CHILDREN
 */

/**
 * @todo  rotating the parent will affect the children
 * @param {entity} parent The parent
 * @param {entity|array} child An entity to attached or an array of entities
 * @example attach(entity1, entity2) attaches entity2 to entity1
 * @example attach(entity1, [entity2, entity3 ...]) attaches multiple entities to entity1
 */
yespix.fn.attach = function(parent, child) {

    if (!parent)
    {
        console.warn('attach :: cannot attach, parent undefined');
        return this;
    }
    if (!child)
    {
        console.warn('attach :: cannot attach, child undefined');
        return this;
    }

    // multiple children
    if (this.isArray(child)) {
        for (var t = 0; t < child.length; t++) this.attach(parent, child[t]);
        return this;
    }

    // try to attach an entity already attached to the parent
    if (child && !child._parent == parent) return null;

    // attach
    if (!parent._children) parent._children = [child];
    else parent._children.push(child);

    if (child._parent) this.detach(child._parent, child);
    child._parent = parent;
    return this;
};

yespix.fn.detach = function(parent, child) {
    if (!parent)
    {
        console.warn('detach :: cannot detach, parent undefined');
        return this;
    }

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
