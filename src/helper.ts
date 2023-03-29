import * as core from '@actions/core'
import PyPI from './pypi'
import {context} from '@actions/github'
import {
  getNextPostVersion,
  getStableVersion,
  isStableVersionGreater
} from './version'

export default class Helper {
  pypi: PyPI

  constructor() {
    this.pypi = new PyPI()
  }

  getInput(name: string): string {
    return context.payload.inputs ? context.payload.inputs[name] : ''
  }

  getBooleanInput(name: string): boolean {
    return context.payload.inputs
      ? context.payload.inputs[name] !== 'false'
      : false
  }

  async getDownloadURL(packageName: string, version: string): Promise<string> {
    const url = await this.pypi.getDownloadURL(packageName, version)
    core.info(`${packageName} download URL: ${url}`)
    core.setOutput(`${packageName}-url`, url)
    return url
  }

  async extractStubsVersions(
    packageName: string,
    stubsPackageName: string,
    force: boolean,
    inputVersion: string | null
  ): Promise<void> {
    core.setOutput('stubs-version', '')

    if (force) {
      core.notice('Force release, skipping version check')
    }

    const version =
      inputVersion || (await this.pypi.getLatestVersion(packageName))

    if (!version) throw new Error(`No version found for ${packageName}`)

    core.notice(`${packageName} version = ${version}`)

    const stubsVersion = await this.pypi.getLatestVersion(
      stubsPackageName,
      getStableVersion(version)
    )
    core.notice(`${stubsPackageName} latest version = ${stubsVersion}`)

    const buildStubsVersion = stubsVersion
      ? getNextPostVersion(stubsVersion)
      : version

    if (!force) {
      const isStubsVersionGreater =
        stubsVersion === null ||
        isStableVersionGreater(buildStubsVersion, stubsVersion)
      if (!isStubsVersionGreater) {
        core.notice(
          'Stubs version is not greater than the latest, skipping run'
        )
        return
      }
    }

    core.notice(`New ${packageName} version found: ${version}`)
    core.notice(`${stubsPackageName} build version = ${buildStubsVersion}`)
    core.setOutput('version', version)
    core.setOutput('stubs-version', buildStubsVersion)
  }
}
