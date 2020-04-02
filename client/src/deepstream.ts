import { DeepstreamClient } from "@deepstream/client";
import config from "./config";

const deepstreamClient = new DeepstreamClient(config.deepstreamUrl);
deepstreamClient.login();

export default deepstreamClient;
