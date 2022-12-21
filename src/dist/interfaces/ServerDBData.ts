import DBProvider from "../types/DBProvider";
interface ServerDBData {
    provider: DBProvider,
    address: string,
    username: string,
    password: string
}
export default ServerDBData;