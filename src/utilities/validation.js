import { object, string, date } from "yup";

let schema = object().shape({
    _id: string().uuid(),
    taskheader: string().required(),
    taskdesc: string().required(),
    uuid: string().uuid(),
    email: string().email(),
    createdOn: date().default(function () {
        return new Date();
    }),
});

async function ObjCheck(obj) {
    return schema.isValid(obj);
}

export { ObjCheck };
