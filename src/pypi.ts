import fetch from 'node-fetch'
import { sortVersions } from './version'

interface IResponseData {
  releases: {
    [key: string]: {
      url: string
    }
  }
}

export default class PyPI {
  async getReleaseVersions(packageName: string): Promise<string[]> {
    const response = await fetch(`https://pypi.org/pypi/${packageName}/json`)
    const data: IResponseData = await response.json()
    return Object.keys(data.releases)
  }

  async getLatestVersion(
    packageName: string,
    versionPrefix: string | null = null
  ): Promise<string | null> {
    let versions = await this.getReleaseVersions(packageName)

    if (versionPrefix) {
      versions = versions.filter(
        x => x.startsWith(`${versionPrefix}.`) || x === versionPrefix
      )
    }

    versions = sortVersions(versions)
    if (!versions.length) return null
    return versions[versions.length - 1]
  }

  async getDownloadURL(packageName: string, version: string): Promise<string> {
    if (!packageName) throw new Error('packageName is not defined')
    if (!version) throw new Error(`version is not defined for ${packageName}`)

    const response = await fetch(`https://pypi.org/pypi/${packageName}/json`)
    const data: IResponseData = await response.json()
    const versionData = data.releases[version]
    if (!versionData) {
      throw new Error(`No download URLs found for ${packageName} ${version}`)
    }
    return versionData.url
  }
}
