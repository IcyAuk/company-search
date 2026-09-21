# company-search

Script de recherche d'entreprise dans l'annuaire du gouvernement français (Javascript).

## Utilisation

```bash
node /home/runner/work/company-search/company-search/company-search.js
```

Par défaut, le script interroge l'endpoint `/search` avec les NAF et codes postaux définis dans le script.

Vous pouvez définir une base d'URL si nécessaire :

```bash
SEARCH_BASE_URL="https://votre-service" node /home/runner/work/company-search/company-search/company-search.js
```
