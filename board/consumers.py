from channels.generic.websocket import AsyncWebsocketConsumer
import json

class WhiteboardConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        
        self.group_name = 'whiteboard'

        await self.channel_layer.group_add(self.group_name, self.channel_name)
            
        await self.accept()
        print(f"WebSocket connection established for {self.channel_name}, joined group {self.group_name}")
        
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        print(f"WebSocket connection closed for {self.channel_name}, left group {self.group_name}, code : {close_code}")
        
    async def receive(self, text_data):
        print(f'receive message from : {self.channel_name} : {text_data}')
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type' : 'whiteboard_update',
                'message' : text_data, 
                'sender_channel_name' : self.channel_name
            }
        )

        print(f'Broadcasted message from {self.channel_name} to group {self.group_name}')        
        
    async def whiteboard_update(self, event):
        message = event['message']
        sender_channel_name = event['sender_channel_name']
        if self.channel_name != sender_channel_name:
            await self.send(text_data=message)
            print(f'Sent group message to client {self.channel_name} (originated from {sender_channel_name})')
        else:
            print(f'Skipped sending message back to originator {self.channel_name}')
        

        
        
               
