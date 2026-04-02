import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .services import handle_message
from asgiref.sync import sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.lead_id = self.scope['url_route']['kwargs']['lead_id']
        self.room_group_name = f'chat_{self.lead_id}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get('message')
        type_event = data.get('type')

        if type_event == 'typing':
            # Broadcast typing indicator to the room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_typing',
                    'lead_id': self.lead_id,
                    'is_typing': data.get('is_typing', True)
                }
            )
            return

        if not message:
            return

        # 1. Show typing status while processing
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_typing',
                'lead_id': 'assistant',
                'is_typing': True
            }
        )

        # 2. Process message using services
        # Note: sync_to_async is needed since handle_message is synchronous (ORM usage)
        response_data = await sync_to_async(handle_message)(self.lead_id, message)

        # 3. Send response back to the room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'data': response_data
            }
        )

        # 4. Hide typing status
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_typing',
                'lead_id': 'assistant',
                'is_typing': False
            }
        )

    async def chat_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps(event['data']))

    async def chat_typing(self, event):
        # Send typing event to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'typing',
            'lead_id': event['lead_id'],
            'is_typing': event['is_typing']
        }))
