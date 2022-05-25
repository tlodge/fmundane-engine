#!/bin/bash
docker run -d --restart unless-stopped -p 5002:5002 -v /home/futuremd/fmundane/fmundane-engine/media:/samples tlodge/voicegen:caravan