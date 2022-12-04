import { object, string, date } from "yup";

let schema = object().shape({
    _id: string(),
    taskheader: string().required(),
    taskdesc: string().required(),
    uuid: string(),
    email: string().email(),
    createdOn: date().default(function () {
        return new Date();
    }),
});

async function ObjCheck(obj) {
    return schema.isValid(obj);
}

export { ObjCheck };
