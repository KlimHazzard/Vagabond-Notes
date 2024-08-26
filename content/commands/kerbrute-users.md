---
title: "Kerbrute Username"
date: 2024-08-25T00:00:00Z
credentials: ["Username"]
phase: ["Enumeration"]
services: ["Kerberos"]
target: ["Windows"]
command: |
  kerbrute userenum --dc 10.10.10.1 -d host.domain -o usernameOutput.out userlist.txt
---
