# Gitlab clipper

Firefox extension to extract issue's information from Gitlab.

Render extracted data as following template:

```md
  Date : <current_date as YYYY-MM-DD>
  Projet : 
  Milestone : [[<milestone>]]
  Source : <url>
  Labels : [[label_1]] [[label_2]] [[label_N]]
  #git
    
---
  
# {{ Title }}
```