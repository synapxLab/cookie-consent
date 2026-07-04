{**
 * SynapxLab Cookie Consent — panneau d'information back office.
 *
 * @author    SynapxLab <contact@synapx.fr>
 * @copyright 2026 SynapxLab
 * @license   https://opensource.org/licenses/MIT MIT License
 *}
<div class="panel">
	<h3><i class="icon icon-shield"></i> {l s='SynapxLab Cookie Consent' mod='synapxcookieconsent'} <small>v{$synapxcc_module_version|escape:'html':'UTF-8'}</small></h3>
	<p>
		{l s='Bannière de consentement aux cookies conforme RGPD/CNIL : consentement préalable (refus par défaut), refus aussi simple que l\'acceptation, blocage automatique des scripts tiers avant consentement, choix révocable à tout moment.' mod='synapxcookieconsent'}
	</p>
	<p>
		{l s='Le fichier JavaScript de la bannière est embarqué dans le module et servi depuis votre boutique : aucun CDN externe n\'est requis.' mod='synapxcookieconsent'}
	</p>

	<h4>{l s='Deux modes de fonctionnement' mod='synapxcookieconsent'}</h4>
	<ul>
		<li>
			<strong>{l s='Sans clé API (défaut)' mod='synapxcookieconsent'}</strong> —
			{l s='Fonctionnement 100 % autonome. Les préférences du visiteur sont stockées dans son navigateur et aucune donnée ne quitte la boutique.' mod='synapxcookieconsent'}
		</li>
		<li>
			<strong>{l s='Avec clé API SynapxLab (optionnel)' mod='synapxcookieconsent'}</strong> —
			{l s='Chaque action de consentement (acceptation, refus, modification) est journalisée et horodatée pour constituer une preuve de consentement (RGPD, article 7.1), consultable depuis votre espace SynapxLab.' mod='synapxcookieconsent'}
			{if $synapxcc_api_key_set}
				<span class="label label-success">{l s='Clé API configurée' mod='synapxcookieconsent'}</span>
			{else}
				<span class="label label-default">{l s='Aucune clé configurée' mod='synapxcookieconsent'}</span>
			{/if}
		</li>
	</ul>

	<p class="help-block">
		{l s='Ce module facilite la gestion du consentement mais ne constitue pas un conseil juridique. Validez votre configuration avec votre DPO ou votre conseil.' mod='synapxcookieconsent'}
	</p>
</div>
