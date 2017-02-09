{
     "intents": [     
          {
          "intent": "LoginIntent",
          "slots": [
                    {
                    "name": "username",
                    "type": "AMAZON.LITERAL"
                    }
               ]
          },
          {
          "intent": "CreateMeetingIntent",
          "slots": [
                    {
                    "name": "meetingName",
                    "type": "AMAZON.LITERAL"
                    }
               ]
          }, 
          {
          "intent": "CreateActionIntent",
          "slots": [
                    {
                    "name": "actionName",
                    "type": "AMAZON.LITERAL"
                    }
               ]
          }, 
          {
          "intent": "CreateDecisionIntent",
          "slots": [
                    {
                    "name": "decisionName",
                    "type": "AMAZON.LITERAL"
                    }
               ]
          }, 
          {
          "intent": "CreateRiskIntent",
          "slots": [
                    {
                    "name": "riskName",
                    "type": "AMAZON.LITERAL"
                    }
               ]
          }, 
          {
          "intent": "CreateInfoIntent",
          "slots": [
                    {
                    "name": "infoName",
                    "type": "AMAZON.LITERAL"
                    }
               ]
          },        		
          {
          "intent": "AMAZON.StopIntent"
          }
     ]
}