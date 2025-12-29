import asyncio
import websockets

connected_clients = set()


async def handler(websocket):
    connected_clients.add(websocket)
    print("client joined")
    try:
        async for message in websocket:
            print(f"Received message from client: {message}")
    finally:
        connected_clients.remove(websocket)
        print("client left")

async def main():
    async with websockets.serve(handler, "localhost", 8765):
        print("Server started on ws://localhost:8765")
        await asyncio.Future()

asyncio.run(main())
