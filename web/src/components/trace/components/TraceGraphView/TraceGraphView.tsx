/**
 * TraceGraphView wrapper
 *
 * This component wraps the TraceGraphView from features/trace-graph-view/
 * and uses data from GraphDataContext.
 */

import { useCallback } from "react";
import { TraceGraphView as TraceGraphViewComponent } from "@/src/features/trace-graph-view/components/TraceGraphView";
import { useTraceGraphData } from "../../contexts/TraceGraphDataContext";
import { useActiveObservationIds } from "../../contexts/PlayheadContext";
import { usePostHogClientCapture } from "@/src/features/posthog-analytics/usePostHogClientCapture";
import { useTraceAnalyticsDimensions } from "../../hooks/useTraceAnalyticsDimensions";

export function TraceGraphView() {
  const { agentGraphData, isLoading } = useTraceGraphData();
  const activeObservationIds = useActiveObservationIds();
  const capture = usePostHogClientCapture();
  const analyticsDimensions = useTraceAnalyticsDimensions();
  // Analytics live here (not in the feature component) so the feature module
  // stays free of trace-view context dependencies.
  const handleObservationSelect = useCallback(() => {
    capture("trace_detail:node_selected", {
      source: "graph",
      ...analyticsDimensions,
    });
  }, [capture, analyticsDimensions]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span className="text-muted-foreground text-sm">Loading graph...</span>
      </div>
    );
  }

  if (agentGraphData.length === 0) {
    return null;
  }

  return (
    <TraceGraphViewComponent
      agentGraphData={agentGraphData}
      activeObservationIds={activeObservationIds}
      onObservationSelect={handleObservationSelect}
    />
  );
}
