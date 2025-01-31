---
title: "WriteUp PG Butch"
date: 2025-01-31T00:00:00Z
type: "post"
draft: true
---

Commands in order

# Recon
# Nmap scan
## all ports, OS, verbose, scripts, fast, output
nmap 192.168.199.63 -p- -O -sV -sC -f -oA butch

# Ports
FTP, SMTP, SMB, RPC, IIS HTTP

# SMB recon no creds
## search SMB list of drives
netexec 
smbclient -L 192.168.129.63 -U '' - P ''

# HTML recon no creds
## Basic HTML response
``` curl -v 192.168.199.63 ```
## gobuster