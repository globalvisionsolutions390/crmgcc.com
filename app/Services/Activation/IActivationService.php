<?php

namespace App\Services\Activation;

use Illuminate\Support\Collection;

interface IActivationService
{


  public function checkValidActivation(?string $licenseKey = null): bool;


  /**
   * Check if the license is activated.
   *
   * @param string|null $licenseKey
   * @return bool
   */
  public function getActivationStatus(?string $licenseKey = null): bool;

  /**
   * Retrieve activation details for a given license key.
   *
   * @param string|null $activationCode
   * @return Collection
   */
  public function getActivationInfo(?string $activationCode = null): Collection;

  /**
   * Activate a license using the provided license key and server info.
   *
   * @param string $activationCode
   * @return Collection
   */
  public function activate(string $licenseKey): Collection;

  /**
   * Activate a license using Envato sale details.
   *
   * @param string $saleCode
   * @param string $envatoUsername
   * @param string $domain
   * @param string $email
   * @param string $activationType Either "live" or "localhost" (defaults to "live")
   * @return Collection
   */
  public function envatoActivate(
    string $saleCode,
    string $envatoUsername,
    string $domain,
    string $email,
    string $activationType = 'live'
  ): Collection;

  /**
   * Retrieve Envato activation details for a given sale code.
   *
   * @param string $saleCode
   * @return Collection
   */
  public function getEnvatoActivationInfo(string $saleCode): Collection;

  /**
   * Deactivate a license.
   *
   * @param string $licenseKey
   * @return bool
   */
  public function deactivate(string $licenseKey): bool;

  /**
   * Verify that the current server details match those stored with the license.
   *
   * @param array $storedServerInfo
   * @return bool
   */
  public function verifyLicenseLock(array $storedServerInfo): bool;
}
