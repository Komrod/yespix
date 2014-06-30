/**
 ************************************************************************************************************
 * CHILDREN
 */

/**
 * @todo  rotating the parent will affect the children
 * @param {entity} parent The parent
 * @param {entity|array} child An entity to attached or an array of entities
 * @example childAdd(entity1, entity2) attaches entity2 to entity1
 * @example childAdd(entity1, [entity2, entity3 ...]) attaches multiple entities to entity1
 */
yespix.fn.childAdd = function(parent, child) {

    if (!parent) {
        console.warn('childAdd :: cannot add child, parent undefined');
        return this;
    }
    if (!child) {
        console.warn('childAdd :: cannot add child, child undefined');
        return this;
    }

    // multiple children
    if (this.isArray(child)) {
        for (var t = 0; t < child.length; t++) this.childAdd(parent, child[t]);
        return this;
    }

    // try to childAdd an entity already attached to the parent
    if (child && !child._parent == parent) return null;

    // childAdd
    if (!parent._children) parent._children = [child];
    else parent._children.push(child);

    if (child._parent) this.childRemove(child._parent, child);
    child._parent = parent;
    return this;
};

yespix.fn.childRemove = function(parent, child) {
    if (!parent) {
        console.warn('childRemove :: cannot remove child, parent undefined');
        return this;
    }

    var t;

    // childRemove everything 
    if (!child) {
        if (parent._children) {
            for (t = 0; t < parent._children.length; t++) parent._children[t]._parent = null;
            parent._children = null;
        }
        return this;
    }

    // childRemove all the children
    if (this.isArray(child)) {
        for (t = 0; t < child.length; t++) this.childRemove(parent, child[t]);
        return this;
    }

    // try to childRemove an entity already detached
    if (child._parent != parent) return null;

    // childRemove one child
    child._parent = null;
    for (t = 0; t < parent._children.length; t++)
        if (parent._children[t] == child) {
            parent._children.splice(t, 1);
            break;
        }
    return this;
};
