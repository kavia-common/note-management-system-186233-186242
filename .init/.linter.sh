#!/bin/bash
cd /home/kavia/workspace/code-generation/note-management-system-186233-186242/note_taking_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

