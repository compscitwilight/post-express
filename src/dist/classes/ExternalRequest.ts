import axios, { AxiosRequestConfig } from "axios";

/**
 * A class that provides static function to aide developers with fetching
 * data from external sites.
 */
class ExternalRequest {
    public static async fetch(url: string, config?: AxiosRequestConfig) {
        let data = await axios.get(url, config);
        return data;
    }
}

export default ExternalRequest;