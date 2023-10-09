function updateOwnerId(next) {
    return function (){
        if(this.isNew && this.userRole == "owner"){
            this.owner = this._id;
            next();
        }else{
            next();
        }
    }
}

exports.updateOwnerId = updateOwnerId;