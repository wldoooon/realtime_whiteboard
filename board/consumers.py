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
        try: 
            data = json.loads(event['message'])
            sender_channel_name = event['sender_channel_name']
            user_id = data.get('userId') # Extract userId
            
            if sender_channel_name == self.channel_name:
                return

            match data.get('type'):
                case 'draw_end':
                    await self._draw_end(data, user_id)
                case 'draw_start':
                    await self._draw_start(data, user_id)
                case 'draw_move':
                    await self._draw_move(data, user_id)
                case _:
                    print('Unknown message type')
        except json.JSONDecodeError:
            print('Invalid JSON format')
        except Exception as e: 
            print(f'Error handling message: {e}')
        
    async def _draw_end(self, data, user_id):
        await self.send(text_data=json.dumps({
            'type' : 'draw_end',
            'lineData' : data['lineData'],
            'userId': user_id}))
    async def _draw_start(self, data, user_id):
        await self.send(text_data=json.dumps({
            'type' : 'draw_start',
            'points' : data['points'],
            'userId': user_id}))
    async def _draw_move(self, data, user_id):
        await self.send(text_data=json.dumps({
            'type' : 'draw_move', 
            'points' : data['points'],
            'userId': user_id
        }))

                

        
        
               