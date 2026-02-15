import { createServer, c4Tools } from "staruml-controller-mcp-core"

export function createC4Server() {
    return createServer("staruml-controller-c4", "1.0.0", c4Tools)
}
