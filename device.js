class device {
    constructor(name, description, type, room){
        var id = global.devices.length;
        this.data = {id:String(id), name:name, description:description, type:type, room:room, capabilities:[
            {type: "devices.capabilities.on_off", retrievable: true}
        ]}
        this.state = false;
        global.devices.push(this);
    }
    getInfo(){
        return this.data;
    }
    setState(val){
        var s = (val)?"on":"off";
        this.state = val;
        console.log(this.data.name, this.data.room, s);
        return [
            {
                "state": {
                    "instance": s,
                    "action_result": {
                        "status": "DONE"
                    }
                }
            }
        ];
    }
}
module.exports = device;