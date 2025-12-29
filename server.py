import asyncio
import websockets

connected_clients = set()
MAX = 2

async def echo(websocket):
    try:
        async for message in websocket:
            print(f"Received message from client: {message}")
            await websocket.send(message)
    finally:
        connected_clients.remove(websocket)

async def main():
    async with websockets.serve(echo, "localhost", 8765):
        print("Server started on ws://localhost:8765")
        await asyncio.Future()

asyncio.run(main())