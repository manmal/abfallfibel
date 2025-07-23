export class DisposalLabel {
    constructor(id, name, type) {
        this.id = id;
        this.name = name;
        this.type = type;
    }

    static fromObject(obj) {
        return new DisposalLabel(obj.id, obj.name, obj.type);
    }
}