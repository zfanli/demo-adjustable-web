// Put some common functions used by reducers.

import axios from 'axios'
import { PanelWithPosition } from '../type'
import { api } from '../config.json'

// API fetch.

/**
 * Get stored panels from backend server.
 * @param sortable
 */
export async function getPanels(
  sortable: boolean
): Promise<PanelWithPosition[]> {
  // Do nothing if api does not exist.
  if (!api.panels) return []

  try {
    const res = await axios.get(api.panels, {
      params: { sortable },
    })
    return res.data as PanelWithPosition[]
  } catch (error) {
    console.log(error)
  }
  return []
}

/**
 * Save current panels to backend server.
 * @param panels
 * @param sortable
 */
export async function setPanels(
  panels: PanelWithPosition[],
  sortable: boolean
): Promise<boolean> {
  // Do nothing if api does not exist.
  if (!api.panels) return true

  try {
    const res = await axios.post(api.panels, {
      panels,
      sortable,
    })
    return res.status === 200
  } catch (error) {
    console.log(error)
    return false
  }
}
