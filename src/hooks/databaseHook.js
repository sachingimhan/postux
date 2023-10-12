function updateOwnerId() {
    return function (next){
        if(this.isNew && this.userRole == "owner"){
            this.owner = this._id;
            next();
        }else{
            next();
        }
    }
}

exports.updateOwnerId = updateOwnerId;